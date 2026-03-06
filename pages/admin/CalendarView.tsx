import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Filter, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { addMinutes, parse } from 'date-fns';

// Localizer for the calendar
const localizer = momentLocalizer(moment);

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: any;
}

const CalendarView: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<any[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string>('all');
    const [view, setView] = useState<any>(Views.WEEK);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        fetchStaff();
        fetchAppointments();
    }, [selectedStaff]);

    const fetchStaff = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name')
            .not('role', 'is', null);
        setStaff(data || []);
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('appointments')
                .select('*, profiles(full_name)')
                .in('status', ['confirmado', 'Confirmado', 'concluído', 'Concluído']);

            if (selectedStaff !== 'all') {
                query = query.eq('staff_id', selectedStaff);
            }

            const { data, error } = await query;

            if (error) throw error;

            const mappedEvents = (data || []).map(apt => {
                // Parse date and time: appointment_date = 'YYYY-MM-DD', appointment_time = 'HH:mm'
                const startStr = `${apt.appointment_date} ${apt.appointment_time}`;
                const startDate = parse(startStr, 'yyyy-MM-dd HH:mm', new Date());

                // Assuming default duration of 60 mins if not specified
                const endDate = addMinutes(startDate, 60);

                return {
                    id: apt.id,
                    title: `${apt.service_type} - ${apt.customer_name}`,
                    start: startDate,
                    end: endDate,
                    resource: apt,
                };
            });

            setEvents(mappedEvents);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
        } finally {
            setLoading(false);
        }
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        const style = {
            backgroundColor: '#FF4095', // Puro Pink
            borderRadius: '12px',
            opacity: 0.9,
            color: 'white',
            border: 'none',
            display: 'block',
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(255, 64, 149, 0.15)'
        };
        return { style };
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-bold text-puro-black">Agenda Visual</h2>
                    <p className="text-gray-500 mt-1">Visualize e organize os horários de toda a equipa.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            className="text-sm font-semibold text-gray-600 bg-transparent border-none focus:ring-0 cursor-pointer"
                        >
                            <option value="all">Todo o Staff</option>
                            {staff.map(s => (
                                <option key={s.id} value={s.id}>{s.full_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_40px_rgb(0,0,0,0.03)] p-6 md:p-8 overflow-hidden min-h-[700px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-puro-pink border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        views={['month', 'week', 'day']}
                        defaultView={Views.WEEK}
                        view={view}
                        onView={(v) => setView(v)}
                        date={date}
                        onNavigate={(d) => setDate(d)}
                        eventPropGetter={eventStyleGetter}
                        messages={{
                            next: "Próximo",
                            previous: "Anterior",
                            today: "Hoje",
                            month: "Mês",
                            week: "Semana",
                            day: "Dia"
                        }}
                        formats={{
                            timeGutterFormat: 'HH:mm',
                            eventTimeRangeFormat: ({ start, end }, culture, local) =>
                                `${local.format(start, 'HH:mm', culture)} - ${local.format(end, 'HH:mm', culture)}`,
                        }}
                    />
                )}
            </div>

            {/* Styles for Calendar Customization */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .rbc-calendar { font-family: 'Outfit', sans-serif !important; }
                .rbc-header { padding: 12px !important; font-weight: 700 !important; color: #4B5563 !important; text-transform: uppercase !important; font-size: 11px !important; letter-spacing: 0.1em !important; border-bottom: 1px solid #F3F4F6 !important; }
                .rbc-today { background-color: #FFF5F9 !important; }
                .rbc-event { border-radius: 12px !important; }
                .rbc-off-range-bg { background: #F9FAFB !important; }
                .rbc-time-view { border: 1px solid #F3F4F6 !important; border-radius: 20px !important; overflow: hidden !important; }
                .rbc-month-view { border: 1px solid #F3F4F6 !important; border-radius: 20px !important; overflow: hidden !important; }
                .rbc-toolbar button { border-radius: 10px !important; border: 1px solid #F3F4F6 !important; padding: 8px 16px !important; font-size: 12px !important; font-weight: 600 !important; color: #6B7280 !important; transition: all 0.2s !important; }
                .rbc-toolbar button:hover { background-color: #F9FAFB !important; color: #FF4095 !important; border-color: #FF4095 !important; }
                .rbc-toolbar button.rbc-active { background-color: #FF4095 !important; color: white !important; border-color: #FF4095 !important; box-shadow: 0 4px 12px rgba(255, 64, 149, 0.2) !important; }
            `}} />
        </div>
    );
};

export default CalendarView;
