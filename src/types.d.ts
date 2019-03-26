interface BeautifyConfig {
  indent_size: number;
  eol: string;
  preserve_newlines: boolean;
  max_preserve_newlines: number;
  space_after_anon_function: boolean;
  brace_style: string;
  unindent_chained_methods: boolean;
  keep_array_indentation: boolean;
  indent_char: string;
  indent_with_tabs: boolean;
  end_with_newline: boolean;
  indent_level: number;
  space_in_paren: boolean;
  space_in_empty_paren: boolean;
  jslint_happy: boolean;
  space_after_named_function: boolean;
  break_chained_methods: boolean;
  unescape_strings: boolean;
  wrap_line_length: number;
  comma_first: boolean;
  operator_position: string;
  indent_empty_lines: boolean;
}
interface LebabFormat {
  enable: boolean;
  showWarnings: boolean;
  showErrors: boolean;
}
interface LebabOptions {
  transforms: string[];
  beautify: BeautifyConfig;
}
export interface LebabConfig {
  format: LebabFormat;
  options: LebabOptions;
}