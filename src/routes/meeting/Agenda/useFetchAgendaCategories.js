import { useEffect, useState, useCallback } from 'react';
import {
    apiMutate
} from "unity-fluent-library"


const useFetchAgendaCategories = (agendaId) => {
    const [agendaCategories, setAgendaCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAgendaCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const meeting_agendaResponse = await apiMutate(
                process.env.REACT_APP_PRODUCTIVITY_API_BASE,
                'cpsMeeting_agenda_category/search',
                {
                    data: {
                        pageNumber: 1,
                        pageSize: 30,
                        orderElements: [
                            { sortColumn: 'agenda_id', sortDirection: 'ASC' }
                        ],
                        filterElements: [
                            { searchField: 'agenda_id', searchOperator: '=', searchValue: agendaId }
                        ]
                    },
                    method: 'POST'
                }
            );

            setAgendaCategories(meeting_agendaResponse.data.pageList);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [apiMutate, agendaId]);

    useEffect(() => {
        fetchAgendaCategories();
    }, [fetchAgendaCategories]);

    return { agendaCategories, loading, error, fetchAgendaCategories };
};

export default useFetchAgendaCategories;
