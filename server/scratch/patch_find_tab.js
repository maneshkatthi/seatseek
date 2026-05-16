const fs = require('fs');
const path = 'd:/B.Tech/Programing languages/React/intership_work/second/client/src/pages/SearchPage.jsx';
const c = fs.readFileSync(path, 'utf8');

const oldBlock = `                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center gap-2.5 bg-blue-500 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                >
                  <Search className="w-4 h-4" />
                  Search Trains
                </motion.button>
              </motion.div>

              {/* Results */}
              <AnimatePresence>
                {searched && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <motion.div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        <span className="text-white font-semibold">{results.length}</span> trains found
                      </p>
                      <motion.div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Zap className="w-3 h-3 text-blue-400" />
                        Live data
                      </motion.div>
                    </motion.div>
                    {results.map((train, i) => (
                      <TrainCard key={train.trainNo} train={train} index={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {!searched && (
                <motion.div className="text-center py-10">
                  <TrainIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Enter stations and tap Search</p>
                  <p className="text-gray-700 text-xs mt-1">Try: Garla → Khammam</p>
                </motion.div>
              )}`;

// Build old block with correct div tags (not motion.div for static elements)
const d = 'div';
const old = `                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center gap-2.5 bg-blue-500 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                >
                  <Search className="w-4 h-4" />
                  Search Trains
                </motion.button>
              </${d}>

              {/* Results */}
              <AnimatePresence>
                {searched && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <${d} className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        <span className="text-white font-semibold">{results.length}</span> trains found
                      </p>
                      <${d} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Zap className="w-3 h-3 text-blue-400" />
                        Live data
                      </${d}>
                    </${d}>
                    {results.map((train, i) => (
                      <TrainCard key={train.trainNo} train={train} index={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {!searched && (
                <${d} className="text-center py-10">
                  <TrainIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Enter stations and tap Search</p>
                  <p className="text-gray-700 text-xs mt-1">Try: Garla → Khammam</p>
                </${d}>
              )}`;

const neu = `                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  disabled={findLoading}
                  className={\`w-full flex items-center justify-center gap-2.5 bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/30 \${findLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-400'}\`}
                >
                  {findLoading ? (
                    <${d} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {findLoading ? 'Searching...' : 'Search Trains'}
                </motion.button>
                <p className="text-xs text-gray-600">Use station codes (e.g. SC, BZA) or pick from suggestions</p>
              </${d}>

              <AnimatePresence>
                {searched && !findLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {findError ? (
                      <${d} className="glass-card p-5 text-center">
                        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                        <p className="text-white font-semibold">Search unavailable</p>
                        <p className="text-red-400 text-sm mt-1">{findError}</p>
                      </${d}>
                    ) : results.length > 0 ? (
                      <>
                        <${d} className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">
                            <span className="text-white font-semibold">{results.length}</span> trains found
                            {routeLabel.from && routeLabel.to && (
                              <span className="text-gray-600"> · {routeLabel.from} → {routeLabel.to}</span>
                            )}
                          </p>
                          <${d} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Zap className="w-3 h-3 text-blue-400" />
                            Live data
                          </${d}>
                        </${d}>
                        {results.map((train, i) => (
                          <TrainCard key={\`\${train.trainNo}-\${i}\`} train={train} index={i} compact />
                        ))}
                      </>
                    ) : (
                      <${d} className="glass-card p-5 text-center">
                        <TrainIcon className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                        <p className="text-white font-semibold">No trains found</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {findMessage || 'Try different station codes, e.g. SC → BZA'}
                        </p>
                      </${d}>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!searched && (
                <${d} className="text-center py-10">
                  <TrainIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Enter stations and tap Search</p>
                  <p className="text-gray-700 text-xs mt-1">Try: Secunderabad (SC) → Vijayawada (BZA)</p>
                </${d}>
              )}`;

if (!c.includes(old.slice(0, 80))) {
  console.error('OLD block not found');
  process.exit(1);
}

fs.writeFileSync(path, c.replace(old, neu));
console.log('patched find tab UI');
