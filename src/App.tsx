import { useState } from "react";

type Fase = {
  aporte: number;
  meses: number;
};

export default function App() {
  const [taxaAnual] = useState<number>(14.75);
  const taxaMensal = taxaAnual / 100 / 12;

  const [fases, setFases] = useState<Fase[]>([]);
  const [mesesExtra, setMesesExtra] = useState<number>(0);

  const adicionarFase = () => {
    setFases([...fases, { aporte: 0, meses: 0 }]);
  };

  const removerFase = (index: number) => {
    const novasFases = fases.filter((_, i) => i !== index);
    setFases(novasFases);
  };

  const atualizarFase = (
    index: number,
    campo: keyof Fase,
    valor: number
  ) => {
    const novasFases = [...fases];
    novasFases[index][campo] = valor;
    setFases(novasFases);
  };

  const calcular = () => {
    let total = 0;
    let totalInvestido = 0;

    // Calcula fases
    fases.forEach((fase) => {
      for (let i = 0; i < fase.meses; i++) {
        total += fase.aporte;
        totalInvestido += fase.aporte;
        total *= 1 + taxaMensal;
      }
    });

    // Aplica os meses extras (juros compostos)
    for (let i = 0; i < mesesExtra; i++) {
      total *= 1 + taxaMensal;
    }

    // Rendimento mensal considerando o total final
    const rendimentoMensalAtualizado = total * taxaMensal;

    return {
      investido: totalInvestido,
      total: total,
      rendimento: total - totalInvestido,
      rendimentoMensalAtualizado,
    };
  };

  const resultado = calcular();

  const isValid =
    fases.length > 0 &&
    fases.every((f) => f.aporte > 0 && f.meses > 0) &&
    mesesExtra >= 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-12 bg-[#0d1117] text-[#c9d1d9]">
      <div className="bg-[#161b22] p-6 rounded-2xl shadow-lg w-full max-w-md border border-[#30363d]">
        <h1 className="text-xl font-bold mb-4 text-white">Simulador CDB (Multi-fases)</h1>
        <h3 className="text-md font-semibold mb-4 text-gray-200">
          Valor da taxa Selic: {taxaAnual}% anual
        </h3>

        {fases.length === 0 && (
          <p className="text-[#8b949e] mb-4">
            Adicione uma fase para iniciar a simulação
          </p>
        )}

        {fases.map((fase, index) => (
          <div key={index} className="mb-4 border border-[#30363d] p-3 rounded bg-[#0d1117]">
            <h2 className="font-semibold mb-2 text-white">Fase {index + 1}</h2>

            <p>Valor do aporte mensal:</p>
            <input
              type="number"
              value={fase.aporte}
              onChange={(e) =>
                atualizarFase(index, "aporte", Number(e.target.value))
              }
              placeholder="Aporte mensal"
              className="w-full bg-[#161b22] border border-[#30363d] p-2 rounded mb-2 text-white placeholder-[#8b949e]"
            />

            <p>Número de meses:</p>
            <input
              type="number"
              value={fase.meses}
              onChange={(e) =>
                atualizarFase(index, "meses", Number(e.target.value))
              }
              placeholder="Meses"
              className="w-full bg-[#161b22] border border-[#30363d] p-2 rounded mb-2 text-white placeholder-[#8b949e]"
            />

            {fases.length > 1 && (
              <button
                onClick={() => removerFase(index)}
                className="text-[#f85149] text-sm hover:underline"
              >
                Remover fase
              </button>
            )}
          </div>
        ))}

        <button
          onClick={adicionarFase}
          className="w-full bg-[#238636] hover:bg-[#2ea043] text-white p-2 rounded mb-4"
        >
          + Adicionar fase
        </button>

        <div className="mb-4">
          <p>Meses adicionais após os aportes:</p>
          <input
            type="number"
            value={mesesExtra}
            onChange={(e) => setMesesExtra(Number(e.target.value))}
            placeholder="Ex: 24"
            className="w-full bg-[#161b22] border border-[#30363d] p-2 rounded mb-2 text-white placeholder-[#8b949e]"
          />
        </div>

        {!isValid && fases.length > 0 && (
          <p className="text-[#f85149] text-sm mb-2">
            Verifique os valores (devem ser positivos)
          </p>
        )}

        {isValid && (
          <div className="space-y-2">
            <p>
              <strong>Total investido:</strong> R$ {resultado.investido.toFixed(2)}
            </p>
            <p>
              <strong>Rendimento total:</strong> R$ {resultado.rendimento.toFixed(2)}
            </p>
            <p>
              <strong>Total final:</strong> R$ {resultado.total.toFixed(2)}
            </p>
            <p>
              <strong>Rendimento mensal após os aportes:</strong> R$ {resultado.rendimentoMensalAtualizado.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}