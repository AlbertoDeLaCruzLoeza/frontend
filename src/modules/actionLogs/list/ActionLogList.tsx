// src/modules/action-logs/list/ActionLogList.tsx
import { Table, message, Input, Button, Space, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { getLogs } from '../../../api/logService';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ActionLogList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para filtros
  const [userId, setUserId] = useState('');
  const [actionType, setActionType] = useState('');
  const [tableAffected, setTableAffected] = useState('');
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Construimos parámetros para el filtro
      const params: any = {};
      if (userId) params.userId = Number(userId);
      if (actionType) params.actionType = actionType;
      if (tableAffected) params.tableAffected = tableAffected;
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      const res = await getLogs(params);

      const processed = res.data.data.records.map((log: any) => ({
        key: log.logId,
        userId: log.userId,
        actionType: log.actionType,
        table: log.tableAffected,
        recordId: log.recordId,
      }));

      setData(processed);
    } catch (err) {
      message.error('La fecha de inicio no puede estar en el futuro');
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

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Usuario ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))} // Solo números
          style={{ width: 120 }}
          allowClear
        />
        <Input
          placeholder="Tipo de Acción"
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          style={{ width: 150 }}
          allowClear
        />
        <Input
          placeholder="Tabla Afectada"
          value={tableAffected}
          onChange={(e) => setTableAffected(e.target.value)}
          style={{ width: 150 }}
          allowClear
        />
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          allowClear
        />
        <Button type="primary" onClick={fetchLogs}>
          Buscar
        </Button>
      </Space>
      <Table columns={columns} dataSource={data} loading={loading} />
    </>
  );
};

export default ActionLogList;