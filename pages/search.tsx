import { DefaultRootState } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { actions } from "../share/domain/engine";
import { HttpMethod } from "../share/domain/interfaces";
import RootElement from "../share/elements/RootElement";
import { transferQueryData } from "../share/library/serverPageHelper";
import { wrapper } from "../share/store";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await (store.dispatch as ThunkDispatch<DefaultRootState, any, AnyAction>)(
      actions.callEndpoint(
        HttpMethod.builder()
          .url(transferQueryData("/api/skills/search/showSearch", ctx))
          .requestType("GET")
          .build()
      )
    );

    return { props: {} };
  }
);

export default RootElement;
