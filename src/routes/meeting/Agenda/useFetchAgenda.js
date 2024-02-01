import { useEffect, useState, useCallback } from 'react';
import { 
    apiMutate
 } from "unity-fluent-library"

const useFetchAgenda = (meetingId) => {
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAgenda = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const meeting_agendaResponse = await apiMutate(
                process.env.REACT_APP_MEETING_MINUTES_API_BASE,
                'cpsMeeting_agenda/search',
                {
                    data: {
                        pageNumber: 1,
                        pageSize: 1,
                        orderElements: [
                            { sortColumn: 'id', sortDirection: 'ASC' }
                        ],
                        filterElements: [
                            { searchField: 'meeting_id', searchOperator: '=', searchValue: meetingId }
                        ]
                    },
                    method: 'POST'
                }
            );

            setAgenda(meeting_agendaResponse.data.pageList[0]);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiMutate, meetingId]);

    useEffect(() => {
        fetchAgenda();
    }, [fetchAgenda]);

    return { agenda, loading, error, fetchAgenda };
};

export default useFetchAgenda;
