import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    decorative: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    decorative?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    decorative: true;
  }
}
