// src/modules/action-logs/list/ActionLogList.tsx
import { Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { getLogs } from '../../../api/logService';

const ActionLogList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getLogs();

      const processed = res.data.map((log: any) => ({
        key: log.log_id,
        userId: log.user_id,
        actionType: log.action_type,
        table: log.table_affected,
        recordId: log.record_id,
      }));

      setData(processed);
    } catch (err) {
      message.error('Error al cargar los registros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    { title: 'Usuario ID', dataIndex: 'userId' },
    { title: 'Acción', dataIndex: 'actionType' },
    { title: 'Tabla', dataIndex: 'table' },
    { title: 'ID del Registro', dataIndex: 'recordId' },
  ];

  return <Table columns={columns} dataSource={data} loading={loading} />;
};

export default ActionLogList;
