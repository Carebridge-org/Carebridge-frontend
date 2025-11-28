import { useNavigate } from "react-router-dom";
import ResidentForm from "../components/ResidentForm";

export default function CreateResidentPage() {
  const navigate = useNavigate();

  function handleSuccess() {
    // Naviger tilbage til oversigt, fx "/resident-overview"
    navigate("/resident-overview");
  }

  return (
    <div className="container mt-4">
      <h2>Opret ny Resident</h2>
      <ResidentForm onSuccess={handleSuccess} />
    </div>
  );
}
