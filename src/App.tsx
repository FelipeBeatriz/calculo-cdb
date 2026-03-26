import { useEffect, useState } from "react";

type Fase = {
  aporte: string;
  meses: string;
};

export default function App() {
  const [taxaAnual, setTaxaAnual] = useState<number>(14.75);
  const [loadingTaxa, setLoadingTaxa] = useState(true);
  const [erroTaxa, setErroTaxa] = useState(false);
 
  const taxaMensal = taxaAnual / 100 / 12;

  const [fases, setFases] = useState<Fase[]>([]);
  const [mesesExtra, setMesesExtra] = useState<number>(0);

  const adicionarFase = () => {
    setFases([...fases, { aporte: "", meses: "" }]);
  };

  const removerFase = (index: number) => {
    const novasFases = fases.filter((_, i) => i !== index);
    setFases(novasFases);
  };

  const atualizarFase = (index: number, campo: keyof Fase, valor: string) => {
    const novasFases = [...fases];
    novasFases[index][campo] = valor;
    setFases(novasFases);
  };

  const calcular = () => {
    let total = 0;
    let totalInvestido = 0;

    // Calcula fases
    fases.forEach((fase) => {
      for (let i = 0; i < parseInt(fase.meses); i++) {
        total += parseFloat(fase.aporte);
        totalInvestido += parseFloat(fase.aporte);
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
    fases.every((f) => parseFloat(f.aporte) > 0 && parseInt(f.meses) > 0) &&
    mesesExtra >= 0;

  // BUSCAR O VALOR DA SELIC ATUAL PARA CALCULAR O RENDIMENTO DO CDB 
  useEffect(() => {
    async function fetchSelic() {
      try {
        const res = await fetch(
          "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"
        );
        const data = await res.json();
        setTaxaAnual(parseFloat(data[0].valor));
      } catch {
        setErroTaxa(true);
      } finally {
        setLoadingTaxa(false);
      }
    }
    fetchSelic();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-12 bg-[#0d1117] text-[#c9d1d9]">
      <div className="bg-[#161b22] p-6 rounded-2xl shadow-lg w-full max-w-md border border-[#30363d]">
        <h1 className="text-xl font-bold mb-4 text-white">Simulador CDB (Multi-fases)</h1>
        <div className="text-md font-semibold mb-4 text-gray-200">
          {loadingTaxa && <span className="text-[#8b949e]">Buscando taxa SELIC...</span>}
          {erroTaxa && <span className="text-[#f85149]">Erro ao buscar a SELIC.</span>}
          {!loadingTaxa && !erroTaxa && `Valor da taxa Selic: ${taxaAnual}% anual`}
        </div>

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
              onChange={(e) => atualizarFase(index, "aporte", e.target.value)}
              placeholder="Aporte mensal..."
              className="w-full bg-[#161b22] border border-[#30363d] p-2 rounded mb-2 text-white placeholder-[#8b949e]"
            />

            <p>Número de meses:</p>
            <input
              type="number"
              value={fase.meses}
              onChange={(e) => atualizarFase(index, "meses", e.target.value)}
              placeholder="Quantidade de meses..."
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
          className="w-full bg-[#238636] hover:bg-[#2ea043] text-white p-2 rounded mb-4 hover:cursor-pointer hover:scale-105 shadow-sm transition-transform"
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