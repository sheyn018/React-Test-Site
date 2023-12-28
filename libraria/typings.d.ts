declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.woff2" {
  const src: string;
  export default src;
}

declare module "*.woff" {
  const src: string;
  export default src;
}
