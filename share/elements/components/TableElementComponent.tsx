import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { TableElement } from "./widgets";

export default function TableElementComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, TableElement);

  useElementEvent(element);

  return (
    <table>
      <thead>
        <tr>
          {element.headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {element.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((data, index) => (
              <td key={index}>{data}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
