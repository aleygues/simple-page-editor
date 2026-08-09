import { styled } from "@linaria/react";

type Props = {
  src: string;
  alt?: string;
  width: string;
  height: string;
  children?: React.ReactNode;
};

const Container = styled.div<Props>`
  width: 100%;
  padding-bottom: ${({ width, height }) =>
    `${(parseInt(height) / parseInt(width)) * 100}%`};
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    ${({ src }) => `url(${src})`};
  color: white;
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export function Banner(props: Props) {
  const params: string[] = [];
  if (props.width) {
    params.push(`width=${props.width}`);
  }
  if (props.height) {
    params.push(`height=${props.height}`);
  }
  const src =
    props.src.startsWith("/api/media") && params.length
      ? `${props.src}?${params.join("&")}`
      : props.src;
  return (
    <Container {...props} src={src}>
      <Content>{props.children}</Content>
    </Container>
  );
}
