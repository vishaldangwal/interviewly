import { QuickActionType } from "@/constants";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

function ActionCard({
  action,
  onClick,
}: {
  action: QuickActionType;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card
        className="group relative overflow-hidden border border-border hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-80`}
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative p-6 size-full">
          <motion.div
            className="space-y-4"
            initial={{ y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/20`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <action.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </motion.div>

            <div className="space-y-2">
              <motion.h3
                className="font-semibold text-xl text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {action.title}
              </motion.h3>

              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                {action.description}
              </motion.p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute -inset-1 bg-blue-500/10 dark:bg-blue-500/5 rounded-lg blur-sm"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </Card>
    </motion.div>
  );
}

export default ActionCard;
