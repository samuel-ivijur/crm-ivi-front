"use client"
import { useState } from "react"
import { LitigationTable } from "@/components/processos/table"
import { AddProcessButton } from "@/components/processos/add-process-button"
import { ProcessStats } from "@/components/processos/stats"
import { ProcessFormProvider } from "@/context/useProcessModalForm"
import { ProcessFormModal } from "@/components/process-form"
import ModalImportData from "@/components/modal-import-data/modal-import-data"
import { litigationColumns } from "./columns"
import { useAuth } from "@/hooks/useAuth"
import { UF } from "@/constants"
import { litigationsService, SaveLitigationBulk } from "@/services/api/litigations"
import { useLitigation } from "@/hooks/useLitigations"
import { useLitigationReport } from "@/hooks/use-litigation-report"

const qualifications: { [k: string]: number } = {
  recorrido: 1,
  recorrente: 2,
  'reu/executado': 3,
  'autor/exequente': 4,
  reu: 5,
  autor: 6,
};

export default function ProcessosPage() {
  const { getSelectedOrganization } = useAuth();
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false)
  const [isModalImportOpen, setIsModalImportOpen] = useState(false)
  const { getAllLitigationsQuery, filter, changeFilter } = useLitigation()
  const { getLitigationReportQuery } = useLitigationReport()

  const handleFinishImport = async (
    rows: Array<{ [k: string]: string }>,
    expectedColumnsToRows: { [k: string]: string },
  ): Promise<boolean> => {
    const params: SaveLitigationBulk.Params = {
      idOrganization: getSelectedOrganization(),
      litigations: rows.map((row: { [k: string]: string }) => ({
        processNumber: row[expectedColumnsToRows[litigationColumns.litigation]],
        instance: +String(row[expectedColumnsToRows[litigationColumns.instance]]).replaceAll(
          /\D/g,
          '',
        ),
        uf: UF.find(
          (uf) => uf.uf === row[expectedColumnsToRows[litigationColumns.uf]].toUpperCase(),
        )?.id,
        court: row[expectedColumnsToRows[litigationColumns.court]],
        nick: row[expectedColumnsToRows[litigationColumns.lawsuit]],
        client: {
          name: row[expectedColumnsToRows[litigationColumns.client]],
          phone: row[expectedColumnsToRows[litigationColumns.phone]],
          idQualification:
            qualifications[
              row[expectedColumnsToRows[litigationColumns.qualification]]
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            ],
        },
        caseCover: {
          distributionDate: row[expectedColumnsToRows[litigationColumns.distributionDate]],
          distributionType: row[expectedColumnsToRows[litigationColumns.distributionType]],
          area: row[expectedColumnsToRows[litigationColumns.area]],
          nature: row[expectedColumnsToRows[litigationColumns.nature]],
        },
      })),
    };
    
    await litigationsService.saveLitigationBulk(params);
    return true;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Processos</h1>
        <AddProcessButton
          setIsModalRegisterOpen={setIsModalRegisterOpen}
          setIsModalImportOpen={setIsModalImportOpen}
        />
      </div>
      
      <ProcessStats />
      
      <LitigationTable 
        data={{
          total: getAllLitigationsQuery.data?.total || 0,
          data: getAllLitigationsQuery.data?.data || [],
          isLoading: getAllLitigationsQuery.isLoading,
        }}
        filter={filter}
        changeFilter={changeFilter}
      />
      <ProcessFormProvider>
        <ProcessFormModal
          open={isModalRegisterOpen}
          onOpenChange={setIsModalRegisterOpen}
        />
      </ProcessFormProvider>

      <ModalImportData
        isModalOpen={isModalImportOpen}
        setIsModalOpen={setIsModalImportOpen}
        title="Importar Processos"
        finish={handleFinishImport}
        docExampleUrl={``}
        expectedColumns={[
          {
            key: litigationColumns.lawsuit,
            example: 'Escritório Silva & Associados',
            previewWidth: 200,
            variant: ['ESCRITÓRIO', 'ADVOGADO', 'NOME DO ADVOGADO', 'NOME DO ESCRITÓRIO'],
          },
          {
            key: litigationColumns.client,
            example: 'João da Silva',
            previewWidth: 200,
            variant: ['CLIENTE', 'NOME DO CLIENTE'],
          },
          {
            key: litigationColumns.qualification,
            example: 'Autor/Exequente',
            previewWidth: 200,
            variant: ['QUALIFICAÇÃO', 'QUALIFICAÇÕES', 'QUALIFICAÇÕES DO CLIENTE'],
          },
          {
            key: litigationColumns.phone,
            example: '(11) 91234-5678',
            previewWidth: 150,
            variant: ['TEL', 'NÚMERO DE TELEFONE'],
          },
          {
            key: litigationColumns.litigation,
            example: '0001234-56.2024.8.26.0001',
            previewWidth: 200,
            variant: ['PROCESSO', 'NÚMERO DO PROCESSO', 'PROTOCOLO'],
          },
          { key: litigationColumns.instance, example: '1ª', previewWidth: 90 },
          { key: litigationColumns.uf, example: 'MG', previewWidth: 40 },
          {
            key: litigationColumns.court,
            example: 'TJMG',
            previewWidth: 140,
            variant: [
              'ÓRGÃO',
              'TRIBUNAL',
              'TRIBUNAL OU ÓRGÃO ADMINISTRATIVO',
              'TRIBUNAL OU ÓRGÃO',
              'ÓRGÃO ADMINISTRATIVO',
            ],
          },
        ]}
      />
    </div>
  )
} 