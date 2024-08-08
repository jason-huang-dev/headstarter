import React from 'react';
import {ChevronRight, ChevronLeft} from 'lucide-react';

/**
 * Custom toolbar for calendar overview in dashboards, topbar of the calendar overview
 */

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const goToView = (view) => {
    toolbar.onView(view);
  };

  return (
    <div className="flex justify-between items-center px-4 pb-4 pt-1 font-sora bg-white shadow-sm w-full">
      <div className="flex items-center">
        <button
          onClick={goToCurrent}
          className="btn px-6 py-2.5 text-md lg:text-sm uppercase text-gray-400 hover:text-black hover:font-bold transition-colors"
        >
          Today
        </button>
        <button
          onClick={goToBack}
          className="btn px-6 py-2.5 text-md border border-r-0 rounded-l-xl lg:text-sm uppercase text-gray-400 hover:text-black hover:bg-gray-100 hover:font-bold transition-colors"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={goToNext}
          className="btn px-6 py-2.5 text-md border border-l-0 rounded-r-xl lg:text-sm uppercase text-gray-400 hover:text-black hover:bg-gray-100 hover:font-bold transition-colors"
        >
          <ChevronRight />
        </button>
      </div>
      <span className="text-lg font-semibold text-black flex-grow text-center">{toolbar.label}</span>
      <div className="flex items-center">
        <button
          onClick={() => goToView('month')}
          className={`btn px-6 py-2.5 text-md lg:text-sm uppercase ${
            toolbar.view === 'month' ? 'text-black' : 'text-gray-400 hover:font-semibold hover:text-black'
          } transition-colors font-semibold`}
        >
          Month
        </button>
        <button
          onClick={() => goToView('week')}
          className={`btn px-6 py-2.5 text-md lg:text-sm uppercase ${
            toolbar.view === 'week' ? 'text-black' : 'text-gray-400 hover:font-semibold hover:text-black'
          } transition-colors font-semibold`}
        >
          Week
        </button>
        <button
          onClick={() => goToView('agenda')}
          className={`btn px-6 py-2.5 text-md lg:text-sm uppercase ${
            toolbar.view === 'agenda' ? 'text-black' : 'text-gray-400 hover:font-semibold hover:text-black'
          } transition-colors font-semibold`}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
