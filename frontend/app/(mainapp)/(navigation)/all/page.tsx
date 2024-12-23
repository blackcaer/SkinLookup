import AllItemList from "@/app/ui/all/all-item-list";
import SearchBar from "@/app/ui/all/search";

export default function Page() {

  return (
    <>
      <div className="mb-4">
        <SearchBar/>
      </div>
      <div>
        <AllItemList/>
      </div>
    </>
  );
}
