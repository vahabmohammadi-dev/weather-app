import Link from "next/link";
import CitySearch from "@/components/CitySearch";
import WeatherCard from "@/components/WeatherCard";

export default function CityPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  return (
    <main className="container">
      <Link href="/" className="back">بازگشت به صفحه اصلی</Link>
      <CitySearch />
      <div style={{ marginTop: 24 }}>
        <WeatherCard name={name} detailed />
      </div>
    </main>
  );
}
