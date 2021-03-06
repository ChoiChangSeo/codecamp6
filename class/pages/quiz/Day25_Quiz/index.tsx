import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";

const FETCH_BOARDS = gql`
  query fetchBoards {
    fetchBoards {
      _id
      writer
      title
      contents
    }
  }
`;

const DELETE_BOARD = gql`
  mutation deleteBoard($boardId: ID!) {
    deleteBoard(boardId: $boardId)
  }
`;

const CREATE_BOARD = gql`
  mutation createBoard($createBoardInput: CreateBoardInput!) {
    createBoard(createBoardInput: $createBoardInput) {
      _id
      writer
      title
      contents
    }
  }
`;

interface IFormValues {
  writer?: string;
  password?: string;
  title?: string;
  contents?: string;
}

const Writer = styled.span`
  margin-right: 10px;
  color: red;
`;
const Title = styled.span`
  margin-right: 10px;
  color: orange;
`;
const Contents = styled.span`
  margin-right: 10px;
  color: blue;
`;

export default function ApolloCacheStatePage() {
  const [deleteBoard] = useMutation(DELETE_BOARD);
  const [createBoard] = useMutation(CREATE_BOARD);
  const { register, handleSubmit } = useForm();
  const { data } = useQuery(FETCH_BOARDS);

  const onClickDelete = (boardId: string) => async () => {
    await deleteBoard({
      variables: { boardId },
      update(cache, { data }) {
        const deleteId = data.deleteBoard;
        cache.modify({
          fields: {
            fetchBoards: (prev, { readField }) => {
              const filteredPrev = prev.filter(
                (el: any) => readField("_id", el) !== deleteId
              );
              return [...filteredPrev];
            },
          },
        });
      },
    });
  };

  const onClickSubmit = async (data: IFormValues) => {
    await createBoard({
      variables: {
        createBoardInput: { ...data },
      },
      update(cache, { data }) {
        data.createBoard;
        cache.modify({
          fields: {
            fetchBoards: (prev) => {
              return [data.createBoard, ...prev];
            },
          },
        });
      },
    });
  };

  return (
    <div>
      {data?.fetchBoards.map((el: any) => (
        <div key={el._id}>
          <Writer>????????? : {el.writer}</Writer>
          <Title>?????? : {el.title}</Title>
          <Contents>?????? : {el.contents}</Contents>
          <button onClick={onClickDelete(el._id)}>X</button>
        </div>
      ))}
      <form onSubmit={handleSubmit(onClickSubmit)}>
        ?????????:
        <input {...register("writer")} />
        ????????????:
        <input {...register("password")} />
        ??????:
        <input {...register("title")} />
        ??????: <input {...register("contents")} />
        <button>????????????</button>
      </form>
    </div>
  );
}
