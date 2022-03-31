import * as S from "./pagination.styled";
import { MouseEvent } from "react";

interface PaginationProps {
  startPage: number;
  onClickPrevPage: () => void;
  onClickPage: (event: MouseEvent<HTMLSpanElement>) => void;
  onClickNextPage: () => void;
  active: string;
  lastPage: number;
  index: number;
}

export default function PaginationUI(props: PaginationProps) {
  return (
    <S.Wrapper>
      <S.Prev disabled={props.startPage === 1} onClick={props.onClickPrevPage}>
        &#60;
      </S.Prev>
      {new Array(10).fill(1).map((_, index) =>
        index + props.startPage <= props.lastPage ? (
          <S.Page
            style={{
              color:
                props.active === String(index + props.startPage)
                  ? "orange"
                  : "black",
            }}
            key={index + props.startPage}
            onClick={props.onClickPage}
            id={String(index + props.startPage)}
          >
            {index + props.startPage}
          </S.Page>
        ) : (
          <span></span>
        )
      )}
      <S.Next
        onClick={props.onClickNextPage}
        disabled={props.startPage + 10 > props.lastPage ? true : false}
      >
        &#62;
      </S.Next>
    </S.Wrapper>
  );
}
