import { styled } from "@linaria/react";

type Props = {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  fit?: "cover" | "contain";
  borderRadius?: boolean;
};

const Img = styled.img<Props>`
  object-fit: ${({ fit }) => (fit ? `${fit}` : "initial")};
  width: ${({ width }) => (width ? `${width}` : "auto")};
  height: ${({ height }) => (height ? `${height}` : "auto")};
  border-radius: ${({ borderRadius }) =>
    borderRadius ? "var(--border-radius)" : "none"};
  overflow: hidden;
`;

export function Image(props: Props) {
  const params: string[] = [];
  if (props.width) {
    params.push(`width=${props.width}`);
  }
  if (props.height) {
    params.push(`height=${props.height}`);
  }
  if (props.fit) {
    params.push(`fit=${props.fit}`);
  }
  const src =
    props.src.startsWith("/api/media") && params.length
      ? `${props.src}?${params.join("&")}`
      : props.src;
  return <Img {...props} src={src} />;
}
