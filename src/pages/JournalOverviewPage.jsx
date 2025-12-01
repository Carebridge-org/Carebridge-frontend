import JournalList from "../components/Journal/JournalList";

export default function JournalOverviewPage({ journals }) {
  return (
    <div className="mt-4">
      <JournalList journals={journals} />
    </div>
  );
}
