import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const performanceData = [
    { course: 'Programming', avgGrade: 85, completion: 92 },
    { course: 'Web Dev', avgGrade: 78, completion: 88 },
    { course: 'Database', avgGrade: 82, completion: 85 },
    { course: 'AI', avgGrade: 75, completion: 80 },
    { course: 'Networks', avgGrade: 88, completion: 95 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics & Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgGrade" fill="#3B82F6" name="Average Grade" />
                <Bar dataKey="completion" fill="#10B981" name="Completion Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Metrics</h2>
          <div className="space-y-4">
            {[
              { label: 'Overall Completion Rate', value: '87%', change: '+5%' },
              { label: 'Average Course Rating', value: '4.5/5', change: '+0.2' },
              { label: 'Student Satisfaction', value: '92%', change: '+3%' },
              { label: 'Active Learning Hours', value: '2,456', change: '+12%' },
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                </div>
                <span className="text-sm text-success-600">{metric.change}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Reports;