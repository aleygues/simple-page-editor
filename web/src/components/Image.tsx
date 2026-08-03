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
  ${({ fit }) => (fit ? `object-fit: ${fit};` : "")}
  ${({ width }) => (width ? `width: ${width};` : "")}
  ${({ height }) => (height ? `height: ${height};` : "")}
  ${({ borderRadius }) =>
    borderRadius ? "border-radius: var(--border-radius);" : ""}
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
