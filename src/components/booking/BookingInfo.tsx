import { Mail, RefreshCw, Globe } from "lucide-react";

interface BookingInfoProps {
  primary: string;
  secondary: string;
  cartes: Array<{
    iconKey: string;
    title: string;
    text: string;
  }>;
}

const iconMap: Record<string, React.ElementType> = {
  Mail: Mail,
  RefreshCw: RefreshCw,
  Globe: Globe
};

export function BookingInfo({ primary, secondary, cartes }: BookingInfoProps) {
  return (
    <section className="mb-1 border border-black container-narrow">
      <div className="container-narrow py-10">
        <h2 className="text-2xl font-bold mb-2">{primary}</h2>
        <p className="text-muted-foreground mb-8">{secondary}</p>
        
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cartes.map(({ iconKey, title, text }) => {
            const Icon = iconMap[iconKey];
            return (
              <div
                key={title}
                className="rounded-2xl border border-black bg-card p-5 shadow-soft"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}