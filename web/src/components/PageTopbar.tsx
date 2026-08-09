import { FiEdit, FiLogOut, FiPlus, FiTrash } from "react-icons/fi";
import { useMe } from "../hooks/me.hook";
import { usePages } from "../hooks/pages.hook";
import { ButtonLink } from "./ButtonLink";
import { Select } from "./Select";
import { Toolbar } from "./Toolbar";
import { Void } from "./Void";
import type { Page } from "../interfaces";
import { Button } from "./Button";
import { useState } from "react";
import { PageEditorModal } from "../modals/PageEditor";
import { useNavigate } from "react-router";

export function PageTopbar(props: { page: Page | null }) {
  const { me, signout } = useMe();
  const { pages } = usePages();
  const navigate = useNavigate();

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return me ? (
    <>
      <PageEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        page={null}
      />
      <Toolbar className="dark">
        {pages && pages.length > 0 ? (
          <Select
            onChange={(event) => {
              const pageId = Number(event.target.value);
              const page = pages.find((page) => page.id === pageId);
              if (page) {
                navigate(`/${page.slug}`);
              }
            }}
          >
            {pages?.map((page) => (
              <option
                selected={props.page?.id === page.id}
                key={page.id}
                value={page.id}
              >
                #{page.id} {page.title}
              </option>
            ))}
          </Select>
        ) : (
          <p>No page</p>
        )}

        <Button fill="clear" onClick={() => setIsEditorOpen(true)}>
          <FiPlus /> New page
        </Button>
        <Void />
        {props.page && (
          <>
            <ButtonLink fill="clear" to={`/editor/pages/${props.page.id}`}>
              <FiEdit /> Edit
            </ButtonLink>
            <Button fill="clear">
              <FiTrash /> Delete
            </Button>
          </>
        )}
        <Void />
        <Button fill="clear" onClick={signout}>
          <FiLogOut /> Sign out
        </Button>
      </Toolbar>
    </>
  ) : null;
}
