import { useAuth } from "@/hooks/useAuth";
import { useLitigation } from "@/hooks/useLitigations";
import { litigationsService } from "@/services/api/litigations";
import { LitigationMonitoringType, LitigationStatus } from "@/constants";

export const useLitigationActions = () => {
  const { getSelectedOrganization } = useAuth();
  const { invalidateQuery } = useLitigation();
  const selectedOrganization = getSelectedOrganization();

  const changeMonitoring = async (id: string, isMonitoring: boolean) => {
    await litigationsService.updateLitigationMonitoring({
      idOrganization: selectedOrganization,
      idLitigation: id,
      monitore: isMonitoring,
      idType: LitigationMonitoringType.PUBLICATIONS,
    });

    setTimeout(invalidateQuery, 500);
  };

  const deleteLitigation = async (id: string) => {
    await litigationsService.deleteLitigationBulk({
      idOrganization: selectedOrganization,
      ids: [id],
    });

    setTimeout(invalidateQuery, 500);
  };

  const archiveLitigation = async (id: string, archive: boolean) => {
    await litigationsService.updateLitigation({
      idOrganization: selectedOrganization,
      idStatus: archive ? LitigationStatus.ARCHIVED : LitigationStatus.ACTIVE,
      id,
    });

    setTimeout(invalidateQuery, 500);
  };

  return {
    changeMonitoring,
    deleteLitigation,
    archiveLitigation,
  };
};
