package utils

import (
	"fmt"
	"os"
)

// AllEnvVarsExists retrieve nill if all specified variables
// exists in environment otherwise fullfill error
func AllEnvVarsExists(vars []string) error {
	for _, v := range vars {
		_, exists := os.LookupEnv(v)
		if !exists {
			return fmt.Errorf("allEnvVarsExists: Required environment variable '%s' not exists", v)
		}
	}
	return nil
}
