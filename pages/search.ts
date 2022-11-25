import createServersidePropsForEndpoint from "../server/infrastructure/application/serverProps";
import { HttpMethod } from "../share/domain/interfaces";
import RootElement from "../share/elements/RootElement";
import { transferQueryData } from "../share/library/serverPageHelper";

export const getServerSideProps = createServersidePropsForEndpoint((_, ctx) =>
  HttpMethod.builder()
    .url(transferQueryData("/api/skills/examples/showSearch", ctx))
    .requestType("GET")
    .build()
);

export default RootElement;
