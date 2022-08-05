use std::path::PathBuf;
use tree_sitter;
use tree_sitter_cli::generate::generate_parser_in_directory;

fn main() {
    // Where to find wing's grammar.js
    let grammar_path = PathBuf::from("grammar");

    // Tell cargo we don't need to re-run this if grammar.js didn't change
    println!(
        "cargo:rerun-if-changed={}",
        grammar_path.join("grammar.js").display()
    ); // TODO: argh! this isn't working, even with canonical paths!

    // Generate our parser (parser.c)
    generate_parser_in_directory(
        &grammar_path,
        None,
        tree_sitter::LANGUAGE_VERSION,
        false,
        None,
    )
    .expect("Generating parser");

    // Build the wing parser library
    let parser_src_path = grammar_path.join("src");
    cc::Build::new()
        .include(&parser_src_path)
        .file(parser_src_path.join("parser.c"))
        .compile("tree-sitter-wing");
}
