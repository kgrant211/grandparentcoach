const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withFixedPodfile = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      
      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
        
        // Fix the incorrect use_native_modules! call
        podfileContent = podfileContent.replace(
          /config = use_native_modules!\(config_command\)/g,
          'config = use_native_modules!'
        );
        
        fs.writeFileSync(podfilePath, podfileContent);
        console.log('✅ Fixed Podfile configuration');
      }
      
      return config;
    },
  ]);
};

module.exports = withFixedPodfile;

