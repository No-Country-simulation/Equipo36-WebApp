import BotonParaCitas from "./BotonParaCitas";

interface Props {
  fecha: string;
  hora: string;
}
const Fecha = ({ fecha, hora }: Props) => {
  return (
    <BotonParaCitas variante="fecha">
      <b>{fecha}</b>
      <p>{hora}</p>
    </BotonParaCitas>
  );
};

export default Fecha;
