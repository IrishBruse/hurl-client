# Tests for hurl parser

Here is the spec for how tests work.

Each folder in here represents tests for a specific `ohm` rule
tests for the whole format live under `hurlFile`.

Inside these folders the file names have some meaning if they end in a `.fail.hurl` then this should fail parsing
there will also be `.hurl.json` files these are the parsed output of the tests store in git for regression testing.
