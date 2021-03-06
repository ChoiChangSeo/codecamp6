import { useRouter } from "next/router";
import BoarderDetailUI from "./BoarderDetail.presenter";
import {
  FETCH_BOARD,
  DELETE_BOARD,
  LIKE_BOARD,
  DISLIKE_BOARD,
} from "./BoarderDetail.queries";
import { useMutation, useQuery } from "@apollo/client";
import { MouseEvent } from "react";
import {
  IMutation,
  IMutationDeleteBoardArgs,
} from "../../../../../../class/src/commons/types/generated/types";

export default function BoardDetail() {
  const [deleteBoard] = useMutation<
    Pick<IMutation, "deleteBoard">,
    IMutationDeleteBoardArgs
  >(DELETE_BOARD);
  const [dislikeBoard] = useMutation(DISLIKE_BOARD);
  const [likeBoard] = useMutation(LIKE_BOARD);
  const router = useRouter();

  const { data } = useQuery(FETCH_BOARD, {
    variables: { boardId: String(router.query.boardId) },
  });

  const onClickDelete = (event: MouseEvent<HTMLDivElement>) => {
    deleteBoard({
      variables: { boardId: String(router.query.boardId) },
      refetchQueries: [
        { query: FETCH_BOARD, variables: { boardId: router.query.boardId } },
      ],
    });
    router.push("/boards");
  };
  const onClickEditPage = () => {
    router.push(`/boards/${String(router.query.boardId)}/edit`);
    console.log(data);
  };

  const onClickListPage = () => {
    router.push(`/boards`);
  };

  const onClickLikeBoard = (event: MouseEvent<HTMLImageElement>) => {
    likeBoard({
      variables: { boardId: router.query.boardId },
      refetchQueries: [
        { query: FETCH_BOARD, variables: { boardId: router.query.boardId } },
      ],
    });
  };

  const onClickDisLikeBoard = (event: MouseEvent<HTMLImageElement>) => {
    dislikeBoard({
      variables: { boardId: router.query.boardId },
      refetchQueries: [
        { query: FETCH_BOARD, variables: { boardId: router.query.boardId } },
      ],
    });
  };
  console.log(data);
  return (
    <BoarderDetailUI
      data={data}
      onClickDelete={onClickDelete}
      onClickEditPage={onClickEditPage}
      onClickListPage={onClickListPage}
      onClickLikeBoard={onClickLikeBoard}
      onClickDisLikeBoard={onClickDisLikeBoard}
    />
  );
}
