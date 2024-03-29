import createServersidePropsForEndpoint from "server/infrastructure/application/serverProps";
import { HttpMethod } from "share/domain/interfaces";
import TemplateManager from "share/elements/TemplateManager";

export const getServerSideProps = createServersidePropsForEndpoint(() =>
  HttpMethod.builder()
    .url("/api/skills/examples/infiniteLoading")
    .requestType("GET")
    .build()
);

export default TemplateManager;
