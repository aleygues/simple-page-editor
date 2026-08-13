import { styled } from "@linaria/react";
import { Image, type ImageProps } from "./Image";

type Props = ImageProps & {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  fill?: "clear" | "solid";
  cursor?: string;
};

const Container = styled.div<{ fill?: "clear" | "solid"; cursor?: string }>`
  display: inline-flex;
  border: ${({ fill }) =>
    fill === "solid" ? "1px solid var(--button-background-color)" : "none"};
  background-color: ${({ fill }) =>
    fill === "solid" ? "var(--button-background-color)" : "transparent"};
  border-radius: var(--input-border-radius);
  padding: ${({ fill }) => (fill === "solid" ? "var(--input-padding)" : "0")};
  cursor: ${({ cursor }) => cursor || "pointer"};
  line-height: normal;

  &:hover,
  &:focus {
    background-color: ${({ fill }) =>
      fill === "solid" ? "var(--input-hover-background-color)" : "transparent"};
  }
`;

export function ImageLink(props: Props) {
  const { onClick, fill, cursor, ...imageProps } = props;

  const params: string[] = [];
  if (imageProps.width) {
    params.push(`width=${imageProps.width}`);
  }
  if (imageProps.height) {
    params.push(`height=${imageProps.height}`);
  }
  if (imageProps.fit) {
    params.push(`fit=${imageProps.fit}`);
  }
  const src =
    imageProps.src.startsWith("/api/media") && params.length
      ? `${imageProps.src}?${params.join("&")}`
      : imageProps.src;

  return (
    <Container fill={fill} cursor={cursor} onClick={onClick}>
      <Image {...imageProps} src={src} />
    </Container>
  );
}
