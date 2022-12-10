import createServersidePropsForEndpoint from "server/infrastructure/application/serverProps";
import { HttpMethod } from "share/domain/interfaces";
import TemplateManager from "share/elements/TemplateManager";
import { transferQueryData } from "share/library/serverPageHelper";

export const getServerSideProps = createServersidePropsForEndpoint((_, ctx) =>
  HttpMethod.builder()
    .url(transferQueryData("/api/skills/examples/showSearch", ctx))
    .requestType("GET")
    .build()
);

export default TemplateManager;
