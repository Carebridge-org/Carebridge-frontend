// src/pages/residentOverview.jsx
import { useMemo } from "react";
import ResidentList from "../components/Resident/ResidentList";

export default function ResidentOverview({ residents }) {
  // Midlertidige data hvis der ikke kommer noget udefra:
  const fallbackResidents = useMemo(
    () => [
      {
        id: 1,
        fullName: "Anna Hansen",
        cpr: "120394-1234",
        department: "Demensafsnit A, 2. sal",
      },
      {
        id: 2,
        fullName: "Peter Jensen",
        cpr: "050180-5678",
        department: "Somatisk, 1. sal",
      },
    ],
    []
  );

  const list = residents && residents.length ? residents : fallbackResidents;

  return (
    <div>
      <h1 className="mb-4">Resident overview</h1>
      <ResidentList residents={list} />
    </div>
  );
}
