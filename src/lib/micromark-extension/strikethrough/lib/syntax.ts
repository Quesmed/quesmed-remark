import {
  Code,
  Construct,
  Effects,
  Event,
  Extension,
  Options,
  Resolver,
  State,
  Token,
  TokenizeContext,
  Tokenizer,
} from 'micromark-util-types';

import { ok as assert } from 'devlop';
import { splice } from 'micromark-util-chunked';
import { classifyCharacter } from 'micromark-util-classify-character';
import { resolveAll } from 'micromark-util-resolve-all';
import { codes, constants, types } from 'micromark-util-symbol';

/**
 * Create an extension for `micromark` to enable GFM strikethrough syntax.
 *
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions`, to
 *   enable GFM strikethrough syntax.
 */
export function strikethrough(options: Options & { singleTilde?: boolean } = {}): Extension {
  const single = options.singleTilde ?? true;

  const tokenizeStrikethrough: Tokenizer = function (
    this: TokenizeContext,
    effects: Effects,
    ok: State,
    nok: State
  ): State {
    const previous = this.previous;
    const events = this.events;
    let size = 0;

    const start: State = function (code: Code) {
      assert(code === codes.tilde, 'expected `~`');

      if (previous === codes.tilde && events[events.length - 1][1].type !== types.characterEscape) {
        return nok(code);
      }

      effects.enter('strikethroughSequenceTemporary');
      return more(code);
    };

    const more: State = function (code: Code) {
      const before = classifyCharacter(previous);

      if (code === codes.tilde) {
        // If this is the third marker, exit.
        if (size > 1) return nok(code);
        effects.consume(code);
        size++;
        return more;
      }

      if (size < 2 && !single) {
        return nok(code);
      }
      const token = effects.exit('strikethroughSequenceTemporary');
      const after = classifyCharacter(code);
      token._open = !after || (after === constants.attentionSideAfter && Boolean(before));
      token._close = !before || (before === constants.attentionSideAfter && Boolean(after));
      return ok(code);
    };

    return start;
  };

  // Take events and resolve strikethrough.
  const resolveAllStrikethrough: Resolver = function (
    events: Event[],
    context: TokenizeContext
  ): Event[] {
    let index = -1;

    // Walk through all events.
    while (++index < events.length) {
      // Find a token that can close.
      if (
        events[index][0] === 'enter' &&
        events[index][1].type === 'strikethroughSequenceTemporary' &&
        events[index][1]._close
      ) {
        let open = index;

        // Now walk back to find an opener.
        while (open--) {
          // Find a token that can open the closer.
          if (
            events[open][0] === 'exit' &&
            events[open][1].type === 'strikethroughSequenceTemporary' &&
            events[open][1]._open &&
            // If the sizes are the same:
            events[index][1].end.offset - events[index][1].start.offset ===
              events[open][1].end.offset - events[open][1].start.offset
          ) {
            events[index][1].type = 'strikethroughSequence';
            events[open][1].type = 'strikethroughSequence';

            const strikethrough: Token = {
              type: 'strikethrough',
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index][1].end),
            };

            const text: Token = {
              type: 'strikethroughText',
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index][1].start),
            };

            // Opening.
            const nextEvents: Event[] = [
              ['enter', strikethrough, context],
              ['enter', events[open][1], context],
              ['exit', events[open][1], context],
              ['enter', text, context],
            ];

            const insideSpan = context.parser.constructs.insideSpan.null;

            if (insideSpan) {
              // Between.
              splice(
                nextEvents,
                nextEvents.length,
                0,
                resolveAll(insideSpan, events.slice(open + 1, index), context)
              );
            }

            // Closing.
            splice(nextEvents, nextEvents.length, 0, [
              ['exit', text, context],
              ['enter', events[index][1], context],
              ['exit', events[index][1], context],
              ['exit', strikethrough, context],
            ]);

            splice(events, open - 1, index - open + 3, nextEvents);

            index = open + nextEvents.length - 2;
            break;
          }
        }
      }
    }

    index = -1;

    while (++index < events.length) {
      if (events[index][1].type === 'strikethroughSequenceTemporary') {
        events[index][1].type = types.data;
      }
    }

    return events;
  };

  const tokenizer: Construct = {
    tokenize: tokenizeStrikethrough,
    resolveAll: resolveAllStrikethrough,
  };

  return {
    text: { [codes.tilde]: tokenizer },
    insideSpan: { null: [tokenizer] },
    attentionMarkers: { null: [codes.tilde] },
  } as Extension;
}
