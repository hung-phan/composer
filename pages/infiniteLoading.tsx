import createServersidePropsForEndpoint from "server/infrastructure/application/serverProps";
import { HttpMethod } from "share/domain/interfaces";
import RootElement from "share/elements/RootElement";

export const getServerSideProps = createServersidePropsForEndpoint(() =>
  HttpMethod.builder()
    .url("/api/skills/examples/infiniteLoading")
    .requestType("GET")
    .build()
);

export default RootElement;
