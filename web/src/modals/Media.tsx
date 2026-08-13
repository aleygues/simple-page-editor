import axios from "axios";
import { Modal } from "../components/Modal";
import type { Media, Page } from "../interfaces";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Row } from "../components/Row";
import { Image } from "../components/Image";
import { Section } from "../components/Section";
import { format } from "date-fns";
import { Button } from "../components/Button";
import { FiCheck, FiFile } from "react-icons/fi";
import { Void } from "../components/Void";

export function MediaModal(props: {
  page?: Page | null;
  onClose: () => void;
  isOpen: boolean;
  onMediaSelect?: (media: Media) => void;
}) {
  const [media, setMedia] = useState<Media[]>();

  async function refetch() {
    const { data } = await axios.get<Media[]>("/api/media");
    setMedia(data);
  }

  useEffect(() => {
    refetch();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (files) => {
      const form = new FormData();
      form.append("media", files[0]);
      await axios.post(`/api/media`, form);
      refetch();
    },
  });

  return (
    <Modal title={"Media"} onClose={props.onClose} isOpen={props.isOpen}>
      <Section>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        {media?.map((media) => {
          const isPdf = media.mimetype === "application/pdf";
          return (
            <Row key={media.id}>
              {isPdf ? (
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--background-color)",
                    borderRadius: "var(--border-radius)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <FiFile
                    style={{
                      width: "48px",
                      height: "48px",
                      color: "var(--color-red)",
                    }}
                  />
                </div>
              ) : (
                <Image
                  src={`/api/media/${media.id}`}
                  width="100px"
                  height="100px"
                  fit="cover"
                  borderRadius
                />
              )}
              <div className="truncate-container">
                <p className="truncate">
                  <strong>{media.name}</strong>
                </p>
                <p className="truncate">
                  Created by {media.createdBy.email} on{" "}
                  {format(new Date(media.createdAt), "PPP")}
                </p>
              </div>
              <Void />
              {props.onMediaSelect &&
                (isPdf ? (
                  <Button
                    fill="clear"
                    onClick={(e) => {
                      e.preventDefault();
                      props.onMediaSelect?.(media);
                    }}
                  >
                    <FiCheck />
                    Use
                  </Button>
                ) : (
                  <Button
                    fill="clear"
                    onClick={() => {
                      props.onMediaSelect?.(media);
                    }}
                  >
                    <FiCheck />
                    Use
                  </Button>
                ))}
            </Row>
          );
        })}
      </Section>
    </Modal>
  );
}
