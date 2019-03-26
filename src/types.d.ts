interface BeautifyConfig {
  indent_size: number;
  eol: string;
  preserve_newlines: boolean;
  max_preserve_newlines: number;
  space_after_anon_function: boolean;
  brace_style: string;
  unindent_chained_methods: boolean;
  keep_array_indentation: boolean;
}

export interface LebabConfig {
  enable: boolean;
  showWarnings: boolean;
  showErrors: boolean;
  transforms: string[];
  beautify: BeautifyConfig;
}