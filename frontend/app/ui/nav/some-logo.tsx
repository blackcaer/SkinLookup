import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function SomeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}>
      <div >
        <PresentationChartLineIcon className="h-12 md:h-28 w-12" />
      </div>
      <p className="text-[32px] "> SkinLookup </p>

    </div>
  );
}
