import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { FETCH_BOARDS_COMMENTS, DELETE_COMMENT } from "./ReplyList.queries";
import ReplyListPresenter from "./ReplyList.presenter";
import { MouseEvent, useState, ChangeEvent } from "react";
import { Modal } from "antd";
import {
  IMutation,
  IMutationDeleteBoardCommentArgs,
  IQuery,
  IQueryFetchBoardCommentsArgs,
} from "../../../../commons/types/generated/types";

export default function ReplyList() {
  const router = useRouter();
  const [deleteBoardComment] = useMutation<
    Pick<IMutation, "deleteBoardComment">,
    IMutationDeleteBoardCommentArgs
  >(DELETE_COMMENT);
  const [password, setPass] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setId] = useState("");

  const showModal = (event: MouseEvent<HTMLImageElement>) => {
    setIsModalVisible((prev) => !prev);
    if (event.target instanceof Element) setId(event.target.id);
  };

  const handleOk = () => {
    setIsModalVisible((prev) => !prev);
  };

  const handleCancel = () => {
    setIsModalVisible((prev) => !prev);
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value);
  };

  const onClickBoardDelete = async () => {
    try {
      await deleteBoardComment({
        variables: {
          boardCommentId: id,
          password: password,
        },
        refetchQueries: [
          {
            query: FETCH_BOARDS_COMMENTS,
            variables: { boardId: String(router.query.boardId) },
          },
        ],
      });
      Modal.success({ content: "댓글이 삭제되었습니다." });
      setIsModalVisible(false);
    } catch (error: any) {
      Modal.error({ content: "댓글 삭제에 실패했습니다." });
    }
  };

  const { data: data2, fetchMore } = useQuery<
    Pick<IQuery, "fetchBoardComments">,
    IQueryFetchBoardCommentsArgs
  >(FETCH_BOARDS_COMMENTS, {
    variables: { boardId: String(router.query.boardId) },
  });

  const onLoadMore = () => {
    if (!data2) return;
    fetchMore({
      variables: { page: Math.ceil(data2.fetchBoardComments.length / 10) + 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.fetchBoardComments)
          return { fetchBoardComments: [...prev.fetchBoardComments] };
        return {
          fetchBoardComments: [
            ...prev.fetchBoardComments,
            ...fetchMoreResult.fetchBoardComments,
          ],
        };
      },
    });
  };

  return (
    <>
      <ReplyListPresenter
        data2={data2}
        onClickBoardDelete={onClickBoardDelete}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onChangePassword={onChangePassword}
        showModal={showModal}
        isModalVisible={isModalVisible}
        onLoadMore={onLoadMore}
      />
    </>
  );
}
