# Stockfish 17.1 (WebAssembly)

`stockfish-17.1-lite-single-03e3232.js` and its `.wasm` are the
single-threaded "lite" WebAssembly build of Stockfish 17.1, taken
unmodified from the Stockfish.js project.

- Stockfish.js — https://github.com/nmrugg/stockfish.js (© Chess.com, LLC)
- Stockfish — https://github.com/official-stockfish/Stockfish
  (© T. Romstad, M. Costalba, J. Kiiski, G. Linscott and contributors)
- Neural nets by Linmiao Xu (linrock)

## License

These files are distributed under the **GNU General Public License v3.0**.
The complete corresponding source for the engine and the build is available
at the Stockfish.js and Stockfish repositories linked above. A copy of the
GPLv3 license header is retained verbatim at the top of the `.js` file.

The single-threaded build is used so the engine runs in a plain Web Worker
without cross-origin isolation (no COOP/COEP headers required).
