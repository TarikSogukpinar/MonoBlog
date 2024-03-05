import HomePage from "../components/home/HomePage";
import NavbarPage from "../components/navbar/NavbarPage";

export default function Page(): JSX.Element {
  return (
    <div>
      <NavbarPage />
      <HomePage></HomePage>
    </div>
  );
}
