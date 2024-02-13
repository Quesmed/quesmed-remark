# quesmed-remark

This is a collection of plugins used by Quesmed for [remark](https://github.com/remarkjs/remark).

## Architecture

```text
                                                               pipeline
+---------------------------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                                             |
|            +----------+        +----------------+        +---------------+       +----------------+       +--------------+                  |
|            |          |        |                |        |               |       |                |       |              |                  |
| -markdown->+  remark  +-mdast->+ remark plugins +-mdast->+ remark-rehype +-hast->+ rehype plugins +-hast->+ rehype-react +-react elements-> |
|            |          |        |                |        |               |       |                |       |              |                  |
|            +----------+        +----------------+        +---------------+       +----------------+       +--------------+                  |
|                                                                                                                                             |
+---------------------------------------------------------------------------------------------------------------------------------------------+
```

As an overview there are a number of different plugins/standards that are used to effectively convert markdown into [mdast](https://github.com/syntax-tree/mdast) (Markdown Abstract Syntax Tree), which can then be converted into [hast](https://github.com/syntax-tree/hast) (Hypertext Abstract Syntax Tree), and ultimately into react elements that can be used by the web or react-native.

At a lower level the markdown -> mdast conversion is handled by [micromark](https://github.com/micromark/micromark) and is built upon extensions that can expand the original CommonMark or GFM specification for markdown.

By building additional plugins we are able to handle extra formatting such as super/subscript or otherwise more complex cases such as our lightgallery implementation. 