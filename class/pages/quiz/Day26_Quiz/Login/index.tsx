import { useRecoilState } from "recoil";
import { Modal } from "antd";
import { useRouter } from "next/router";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { accessTokenState, userInfoState } from "../../../../src/commons/store";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("/LoginBackground.jpg");
`;
const LoginWrapper = styled.div`
  width: 30%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15%;
  padding: 3% 3%;
  border-radius: 5%;
  border: 1px solid lightgray;
`;
const Email = styled.input`
  width: 80%;
  height: 25%;
  margin-bottom: 1%;
  border: 1px solid lightgray;
  border-radius: 10px;
  background-color: transparent;
  color: gray;
`;

const Password = styled.input`
  width: 80%;
  height: 25%;
  margin-bottom: 5%;
  border: 1px solid lightgray;
  border-radius: 10px;
  background-color: transparent;
  color: gray;
`;
const LoginButton = styled.button`
  width: 80%;
  height: 25%;
  margin-bottom: 10%;
  border-radius: 10px;
  background-color: gray;
  cursor: pointer;
`;
const MarkLine = styled.div`
  width: 80%;
  margin-bottom: 5%;
  border: none;
  border-top: 1px solid gray;
`;

const LoginNavWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const SignUp = styled.div`
  color: gray;
  cursor: pointer;
`;
const ErrorMsg = styled.div`
  width: 100%;
  height: 5%;
  margin-left: 20%;
  margin-bottom: 3%;
  color: red;
`;

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
    }
  }
`;

const FETCH_USER_LOGGED_IN = gql`
  query fetchUserLoggedIn {
    fetchUserLoggedIn {
      email
      name
    }
  }
`;

const schema = yup.object({
  email: yup
    .string()
    .email("????????? ????????? ???????????? ????????????.")
    .required("???????????? ?????????????????????."),
  password: yup
    .string()
    .min(8, "??????????????? 8?????? ???????????????.")
    .max(16, "??????????????? 16?????? ???????????????.")
    .required("??????????????? ?????????????????????."),
});
interface ILogin {
  email?: string;
  password?: string;
}

export default function LoginPageContainer() {
  const [loginUser] = useMutation(LOGIN_USER);
  const [, setUserInfo] = useRecoilState(userInfoState);
  const router = useRouter();
  const [, setAccessToken] = useRecoilState(accessTokenState);
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const client = useApolloClient();

  const onClickLogin = async (data: ILogin) => {
    try {
      const result = await loginUser({
        variables: { ...data },
      });
      const accessToken = result.data.loginUser.accessToken;
      setAccessToken(accessToken);

      const resultUserInfo = await client.query({
        query: FETCH_USER_LOGGED_IN,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });
      const userInfo = resultUserInfo.data.fetchUserLoggedIn;
      setAccessToken(accessToken);
      setUserInfo(userInfo);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      Modal.success({
        content: "???????????? ?????????????????????.",
      });
      const basket = JSON.parse(localStorage.getItem("baskets") || "[]");
      if (basket.length >= 1) {
        Modal.success({
          content:
            "??????????????? ?????? ???????????? ????????????. ????????????????????????? ???????????? ????????? ???????????????",
        });
        router.push("/quiz/Day26_Quiz/basketList");
      }
    } catch (error) {
      Modal.error({ content: "???????????? ?????????????????????." });
    }
  };

  const onClickMove = () => {
    router.push("/quiz/Day26_Quiz/basketList");
  };
  return (
    <Wrapper>
      <LoginWrapper>
        <form onSubmit={handleSubmit(onClickLogin)}>
          <Email
            {...register("email")}
            placeholder="???????????? ??????????????????"
          ></Email>
          <ErrorMsg>{formState.errors.email?.message}</ErrorMsg>
          <Password
            {...register("password")}
            placeholder="??????????????? ??????????????????"
          ></Password>
          <ErrorMsg>{formState.errors.password?.message}</ErrorMsg>
          <LoginButton isActive={formState.isValid}>???????????????</LoginButton>
        </form>
        <MarkLine></MarkLine>
        <LoginNavWrapper>
          {/* <EmailFind>????????? ??????</EmailFind>
                      <Mark></Mark>
                      <PasswordFind>???????????? ??????</PasswordFind>
                      <Mark></Mark> */}
          <SignUp onClick={onClickMove}>????????????</SignUp>
        </LoginNavWrapper>
      </LoginWrapper>
    </Wrapper>
  );
}
