import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { budgetSteps } from "@/data/budgetSteps";

type BudgetSectionProps = {
  description?: string;
  eyebrow?: string;
  title?: string;
};

const budgetDefaults = {
  description:
    "Para uma estimativa mais precisa, envie as principais informações do sofá desejado. Com esses detalhes, o atendimento fica mais claro, ágil e personalizado.",
  eyebrow: "Orçamento sob medida",
  title: "Como solicitar seu orçamento",
};

export function BudgetSection({
  description = budgetDefaults.description,
  eyebrow = budgetDefaults.eyebrow,
  title = budgetDefaults.title,
}: BudgetSectionProps) {
  return (
    <Section
      id="orcamento"
      className="bg-background"
      aria-labelledby="budget-title"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-accent">
              {eyebrow}
            </p>
            <h2
              id="budget-title"
              className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl"
            >
              {title}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:justify-self-end">
            <p className="max-w-xl text-base leading-8 text-muted">
              {description}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {budgetSteps.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 0.05}
              className="group rounded-lg border border-primary/10 bg-background/80 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-background hover:shadow-lift"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-serif text-3xl font-semibold text-primary">
                  {step.title}
                </h3>
                <span className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
                  0{index + 1}
                </span>
              </div>
              <div className="mt-5 h-px w-12 bg-accent/70 transition duration-300 group-hover:w-16" />
              <p className="mt-5 text-sm leading-7 text-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
