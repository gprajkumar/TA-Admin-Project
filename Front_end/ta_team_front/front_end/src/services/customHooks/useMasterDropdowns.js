import { useSelector } from "react-redux";
import { useMemo } from "react";

const useMasterDropdowns = () => {
  const master_dropdown = useSelector((state) => state.master_dropdown || {});

  const dropdowns = useMemo(() => {
    return {
      drop_down_endClients: master_dropdown.endClients,
      drop_down_clients: master_dropdown.clients,
      drop_down_jobStatus: master_dropdown.jobStatus,
      drop_down_accountManagers: master_dropdown.accountManagers,
      drop_down_hiringManagers: master_dropdown.hiringManagers,
      drop_down_roleTypes: master_dropdown.roleTypes,
      drop_down_employees: master_dropdown.employees,
      drop_down_accounts: master_dropdown.accounts,
      drop_down_sources: master_dropdown.sources,
    };
  }, [master_dropdown]);

  return dropdowns;
};

export default useMasterDropdowns;
