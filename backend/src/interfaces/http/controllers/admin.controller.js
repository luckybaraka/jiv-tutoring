const ExcelJS = require('exceljs');
const bookingService = require('../../../domains/booking/services/BookingService');

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'short', day: '2-digit',
  }) : '';

class AdminController {
  async listBookings(req, res, next) {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.curriculum) filters.curriculum = req.query.curriculum;
      if (req.query.sessionType) filters.sessionType = req.query.sessionType;

      const limit = parseInt(req.query.limit, 10) || 50;
      const skip = parseInt(req.query.skip, 10) || 0;

      const bookings = await bookingService.listBookings(filters, { limit, skip });
      res.json({
        success: true,
        count: bookings.length,
        data: bookings.map((b) => b.toJSON()),
      });
    } catch (err) {
      next(err);
    }
  }

  async stats(req, res, next) {
    try {
      const stats = await bookingService.getStatistics();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  async approve(req, res, next) {
    try {
      const booking = await bookingService.approveBooking(req.params.id);
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  async reject(req, res, next) {
    try {
      const booking = await bookingService.rejectBooking(
        req.params.id,
        req.body.reason || 'Not specified'
      );
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  async complete(req, res, next) {
    try {
      const booking = await bookingService.completeBooking(req.params.id);
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    try {
      const booking = await bookingService.cancelBooking(req.params.id);
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  async deleteBooking(req, res, next) {
    try {
      await bookingService.deleteBooking(req.params.id);
      res.json({ success: true, message: 'Booking deleted permanently' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Streams an .xlsx file with all bookings (filters applied if provided).
   */
  async exportBookings(req, res, next) {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.curriculum) filters.curriculum = req.query.curriculum;
      if (req.query.sessionType) filters.sessionType = req.query.sessionType;

      const bookings = await bookingService.listBookings(filters, {
        limit: 10000,
        skip: 0,
      });

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'JIV Tutoring Services';
      workbook.created = new Date();

      const sheet = workbook.addWorksheet('Bookings', {
        properties: { defaultColWidth: 18 },
      });

      sheet.columns = [
        { header: 'Booking ID', key: 'id', width: 38 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Created', key: 'createdAt', width: 14 },
        { header: 'Session', key: 'sessionType', width: 12 },
        { header: 'Curriculum', key: 'curriculum', width: 12 },
        { header: 'Subjects', key: 'subjects', width: 30 },
        { header: 'Scheduled Date', key: 'scheduledDate', width: 16 },
        { header: 'Local Time', key: 'time', width: 14 },
        { header: 'Timezone', key: 'timezone', width: 22 },
        { header: 'Start (UTC)', key: 'startUtc', width: 22 },
        { header: 'End (UTC)', key: 'endUtc', width: 22 },
        { header: 'Duration (min)', key: 'duration', width: 14 },
        { header: 'Parent Name', key: 'parentName', width: 24 },
        { header: 'Parent Email', key: 'parentEmail', width: 28 },
        { header: 'Parent Phone', key: 'parentPhone', width: 16 },
        { header: 'Students', key: 'students', width: 40 },
        { header: '# Students', key: 'studentCount', width: 12 },
        { header: 'Group Discount %', key: 'discount', width: 16 },
        { header: 'Free Trial', key: 'freeTrial', width: 12 },
        { header: 'Notes', key: 'notes', width: 30 },
        { header: 'Rejection Reason', key: 'rejectionReason', width: 24 },
      ];

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FF0A2E6F' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' },
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
      headerRow.border = {
        bottom: { style: 'medium', color: { argb: 'FFFBBF24' } },
      };

      bookings.forEach((b) => {
        const data = b.toJSON();
        sheet.addRow({
          id: data.id,
          status: data.status,
          createdAt: formatDate(data.createdAt),
          sessionType: data.sessionType,
          curriculum: data.curriculum,
          subjects: (data.subjects || []).join(', '),
          scheduledDate: formatDate(data.startAt || data.scheduledDate),
          time: `${data.timeSlot?.startTime || ''}–${data.timeSlot?.endTime || ''}`,
          timezone: data.timezone || '',
          startUtc: data.startAt ? new Date(data.startAt).toISOString() : '',
          endUtc: data.endAt ? new Date(data.endAt).toISOString() : '',
          duration: data.timeSlot?.durationMinutes,
          parentName: data.parent?.fullName,
          parentEmail: data.parent?.email,
          parentPhone: data.parent?.phone,
          students: (data.students || [])
            .map(
              (s) =>
                `${s.name} (age ${s.age}, ${s.gradeOrClass})${
                  s.learningChallenges ? ` — ${s.learningChallenges}` : ''
                }`
            )
            .join(' | '),
          studentCount: (data.students || []).length,
          discount: data.discountPercentage || 0,
          freeTrial: data.isFreeTrialed ? 'Yes' : 'No',
          notes: data.notes || '',
          rejectionReason: b.rejectionReason || '',
        });
      });

      sheet.eachRow({ includeEmpty: false }, (row) => {
        row.alignment = { vertical: 'top', wrapText: true };
      });

      const filename = `jiv-bookings-${new Date().toISOString().split('T')[0]}.xlsx`;
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
